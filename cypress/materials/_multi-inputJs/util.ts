export function jsonToSchema(json): any {
  const schema = { type: void 0 };
  proItem({ schema, val: json });
  if (schema.type) {
    return schema;
  } else {
    return;
  }
}

function proItem({ schema, val, key, fromAry }: { schema; val; key?; fromAry?}) {
  if (Array.isArray(val)) {
    const items = {};
    if (key) {
      schema[key] = {
        type: 'array',
        items
      };
    } else {
      schema.type = 'array';
      schema.items = items;
    }

    proAry(items, val);
  } else {
    if (typeof val === 'object' && val) {
      let nSchema;
      if (fromAry) {
        schema.type = 'object';
        nSchema = schema.properties = {};
      }

      const properties = fromAry ? nSchema : {};

      if (!fromAry) {
        if (key) {
          schema[key] = {
            type: 'object',
            properties
          };
        } else {
          schema.type = 'object';
          schema.properties = properties;
        }
      }

      proObj(properties, val);
    } else {
      const type = val === null || val === void 0 ? 'any' : typeof val;
      if (key === void 0) {
        schema.type = type;
      } else {
        schema[key] = { type }
      }
    }
  }
}

function proObj(curSchema, obj) {
  Object.keys(obj).map((key) => {
    return proItem({ schema: curSchema, val: obj[key], key });
  });
}

function proAry(curSchema, ary) {
  let sample;
  if (ary.length > 0) {
    sample = ary[0];
  }

  proItem({ schema: curSchema, val: sample, fromAry: true });
}


export function convertObject2Array(input) {
  let result = [] as any[];
  Object.keys(input).sort((a, b) => {
    let _a = a?.match(/\d+/g)?.[0] || 0;
    let _b = b?.match(/\d+/g)?.[0] || 0;
    return +_a - +_b;
  }).forEach((key) => {
    result.push(input[key]);
  });
  return result;
}