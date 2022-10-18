const { validateEditMaterialAtributes,
  validateEditPayAtributes,
} = require("../util/validators");


const testObj2 = {
  wrongField: "456",
  anotherWoodType: "22",
  widthMaterial: "100",
  blockType: {},
};


test("validateEditMaterialAtributes", () => {
  const testObj = {
    houseId: "55555555555555",
    widthMaterial: "",
    concreteType: "Другое",
  };
  expect(validateEditMaterialAtributes(testObj)).toEqual({
    errors: {},
    values: {
      concreteType: "Другое",
      houseId: "55555555555555",
      widthMaterial: null,
    },
  });

  const testObj2 = {
    wrongField: "456",
    anotherWoodType: "22",
    widthMaterial: "100",
    blockType: {},
  };
  expect(validateEditMaterialAtributes(testObj2)).toEqual({
    errors: {
      blockType: "Не строка",
      wrongField: "Неизвестное поле",
    },
    values: {
      anotherWoodType: "22",
      widthMaterial: 100,
    },
  });
});


test("validateEditPayAtributes", () => {
  const testPayObj = {
    item: 2,
    title: "55",
  };
  expect(validateEditPayAtributes(testPayObj)).toStrictEqual({
    errors: {},
    values: {
      item: 2,
      title: "55",
    },
  });

  const testPayObj2 = {
    item: 2,
    title: "1",
    description: "111",
    link: "3333",
    price: "7899",
  };
  expect(validateEditPayAtributes(testPayObj2)).toStrictEqual({
    errors: {},
    values: {
      item: 2,
      title: "1",
      description: "111",
      link: "3333",
      price: 7899,
    },
  });
});
