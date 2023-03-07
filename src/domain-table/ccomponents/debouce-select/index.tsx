import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import React, {FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

interface DebounceSelectProps {
	value?: string;
	onChange?(value: string): void;
	fetchParams: Record<string, unknown>;
	field: Record<string, unknown>;
	placeholder: string;
}
type ValueType = any;

const DebounceSelect: FC<DebounceSelectProps> = (props) => {
	const { value, fetchParams, onChange, field, placeholder } = props;
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState<ValueType[]>([]);
	const fetchRef = useRef(0);
	
	const fetchOptions = useCallback((value: string) => {
		setFetching(true);
		return fetch('/api/system/domain/run', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: undefined,
			body: JSON.stringify({
				...fetchParams,
				params: { action: 'SEARCH_BY_FIELD', field, query: { keyword: value }  }
			})
		} as RequestInit)
		.then(res => res.json())
		.then(data => {
			return (data.data ?? []).map(item => {
				let label = '';
				Object.keys(item)
					.filter(key => key !== 'id')
					.forEach(key => {
						label += label ? '-' + item[key] : item[key];
					});
				return { label: label || item.id, value: item.id };
			});
		})
		.finally(() => setFetching(false));
	}, [fetchParams, field]);
	
	const debounceFetcher = useMemo(() => {
		const loadOptions = (value: string) => {
			fetchRef.current += 1;
			const fetchId = fetchRef.current;
			
			fetchOptions(value).then(newOptions => {
				if (fetchId !== fetchRef.current) {
					return;
				}
				
				setOptions(newOptions);
			});
		};
		
		return debounce(loadOptions, 800);
	}, [fetchOptions]);
	
	useEffect(() => {
		if (value) {
			fetchOptions(value).then(options => setOptions(options));
		}
	}, [value]);
	
	return (
		<Select
			showSearch
			allowClear
			defaultActiveFirstOption
			showArrow={false}
			filterOption={false}
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size="small" /> : null}
			options={options}
			value={value as ValueType}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
};

export default DebounceSelect;