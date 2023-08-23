/**
 * @param documentTitle 保存为文件时文件名
 * @param closeScene 打印对话框关闭后是否关闭对话窗口
 * @param useFooter 是否展示底部操作栏
 * @param closable 是否显示关闭按钮
 */
export interface Data {
	documentTitle: string,
	closeScene: boolean,
	useFooter: boolean,
	closable: boolean
}

export enum InputIds {
	StartPrint = 'startPrint',
}