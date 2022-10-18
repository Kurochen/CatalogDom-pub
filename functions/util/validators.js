
const onlyConst = (arr, key, value, values, errors) => {
  const set = new Set(arr);
  if (typeof value !== "string") {
    errors[key] = "Не строка";
  } else if (value.trim() === "") {
    value[key] = null;
  } else if (!set.has(value)) {
    errors[key] = "Неизвестные данные";
  } else {
    values[key] = value;
  }
};

const onlyConstNum = (arr, key, value, values, errors) => {
  const set = new Set(arr);
  value = parseFloat(value);
  if (isNaN(value)) {
    values[key] = null;
  } else if (set.has(value)) {
    values[key] = value;
  } else {
    errors[key] = "Неизвестние данные";
  }
};

const numberType = (min, max, key, value, values, errors) => {
  value = parseFloat(value);
  if (isNaN(value)) {
    values[key] = null;
  } else if (value > max) {
    errors[key] = `Число больше ${max}`;
  } else if (value < min) {
    errors[key] = `Число меньше ${min}`;
  } else {
    values[key] = value;
  }
};

const stringType = (max, key, value, values, errors) => {
  if (typeof value !== "string") {
    errors[key] = "Не строка";
  } else if (value.trim() === "") {
    values[key] = null;
  } else if (value.length > max) {
    errors[key] = `Поле больше ${max} знаков`;
  } else {
    values[key] = value;
  }
};

const booleanType = (key, value, values, errors) => {
  if (value === "true" || value === true) {
    values[key] = true;
  } else if (value === "false" || value === false) {
    values[key] = false;
  } else {
    errors[key] = "Not true/false";
  }
};

exports.validateProfileData = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "name":
      case "city":
      case "linkFH":
      case "linkVK":
        stringType(100, key, value, values, errors);
        break;
      case "bio":
        stringType(1000, key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateProfilePrivateData = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "phone":
        stringType(14, key, value, values, errors);
        break;
      case "secretKeyQiwi":
        stringType(220, key, value, values, errors);
        break;
      case "publicKeyQiwi":
        stringType(219, key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateAddNewHouse = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "name":
        stringType(14, key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }
  return {
    errors,
    values,
  };
};

exports.validateEditMainAtributes = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
        stringType(100, key, value, values, errors);
        break;
      case "name":
        stringType(14, key, value, values, errors);
        break;
      case "area":
        numberType(10, 3000, key, value, values, errors);
        break;
      case "floors":
        onlyConstNum([1, 1.5, 2, 2.5, 3, 3.5, 4], key, value, values, errors);
        break;
      case "length":
        numberType(1, 30, key, value, values, errors);
        values.length_2 = Math.round(values.length / 2) * 2;
        break;
      case "width":
        numberType(1, 30, key, value, values, errors);
        values.width_2 = Math.round(values.width / 2) * 2;
        break;
      case "foundation":
        onlyConst(["Другое", "Лента", "Сваи", "Плита", "Подвал"], key, value, values, errors);
        break;
      case "roof":
        onlyConst(["Другое", "Плоскя", "Односкатная", "Двухскатная", "Четырехскатная"], key, value, values, errors);
        break;
      case "typeBuilding":
        onlyConst(["Другое", "Дом", "Баня"], key, value, values, errors);
        break;
      case "material":
        onlyConst(["Другое", "Кирпич", "Блоки", "Дерево", "Бетон"], key, value, values, errors);
        break;
      case "description":
        stringType(1000, key, value, values, errors);
        break;
      case "descriptionURL":
        stringType(500, key, value, values, errors);
        break;
      case "visible":
        booleanType(key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateEditMaterialAtributes = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
        stringType(100, key, value, values, errors); // todo length Id
        break;
      case "widthMaterial":
        numberType(5, 1500, key, value, values, errors);
        break;
      case "concreteType":
        onlyConst(["Другое", "Каркас", "Монолит"], key, value, values, errors);
        break;
      case "anotherConcreteType":
      case "keramikaType":
      case "anotherBlockType":
      case "anotherWoodType":
      case "materialAnotherType":
        stringType(20, key, value, values, errors);
        break;
      case "blockType":
        onlyConst(["Другое", "Пенобетон", "Газобетон", "Керамика", "Арболит"], key, value, values, errors);
        break;
      case "woodType":
        onlyConst(["Другое", "Брус", "Бревно", "Каркас", "Панели"], key, value, values, errors);
        break;
      case "brusType":
        onlyConst(["Другое", "Клееный", "Погонажный", "Профилированый", "Двойной"], key, value, values, errors);
        break;
      case "brevnoDiameter":
        numberType(80, 500, key, value, values, errors);
        break;
      case "brusHeight":
      case "brusWidth":
        numberType(40, 500, key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateEditPayAtributes = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
        stringType(100, key, value, values, errors); // todo length Id
        break;
      case "item":
        onlyConstNum([1, 2, 3], key, value, values, errors); // todo length Id
        break;
      case "title":
        stringType(15, key, value, values, errors);
        break;
      case "price":
        numberType(1, 35000, key, value, values, errors);
        break;
      case "description":
        stringType(400, key, value, values, errors);
        break;
      case "link":
        stringType(400, key, value, values, errors);
        break;
      case "visible":
        booleanType(key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateImageMeta = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
        stringType(100, key, value, values, errors); // todo length Id
        break;
      case "item":
        onlyConstNum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], key, value, values, errors); // todo length Id
        break;
      case "title":
        stringType(15, key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateImageDelete = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
        stringType(100, key, value, values, errors); // todo length Id
        break;
      case "item":
        onlyConstNum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], key, value, values, errors); // todo length Id
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateDeleteHouse = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
        stringType(100, key, value, values, errors); // todo length Id
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }

  return {
    errors,
    values,
  };
};

exports.validateCreateBillQiwiPay = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "houseId":
      case "sellerId":
      case "userName":
      case "userPhone":
        stringType(100, key, value, values, errors); // todo length Id
        break;
      case "payId":
        numberType(0, 3, key, value, values, errors);
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }
  return {
    errors,
    values,
  };
};

exports.validateCheckBillQiwiPay = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "billId":
        stringType(72, key, value, values, errors); // Длина строки так то 36, но на всякий случай пусть будет 72
        break;
      case "sellerId":
        stringType(100, key, value, values, errors);
        break;

      default:
        errors[key] = "Неизвестное поле";
    }
  }
  return {
    errors,
    values,
  };
};

exports.validateDeleteBillQiwiPay = (data) => {
  let errors = {};
  let values = {};

  for (let [key, value] of Object.entries(data)) {
    switch (key) {
      case "billId":
        stringType(72, key, value, values, errors); // Длина строки так то 36, но на всякий случай пусть будет 72
        break;
      default:
        errors[key] = "Неизвестное поле";
    }
  }
  return {
    errors,
    values,
  };
};
