import { formatToCPF } from "brazilian-values";
import mime from "mime";

export const dateTimeFormater = (value) => {
  if (value !== "") {
    return `${new Date(value).toLocaleDateString()} ${new Date(
      value
    ).toLocaleTimeString()}`;
  }
  return value;
};

export const arrayToObjectString = (arr) => {
  if (!Array.isArray(arr)) {
    return arr;
  }

  if (arr.length === 0) {
    return `{}`;
  }

  let str = "";
  for (let i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      str += arr[i];
    } else {
      str += arr[i] + ",";
    }
  }

  return `{${str}}`;
};

export const objectStringToArray = (str) => {
  if (Array.isArray(str)) {
    return str;
  }

  if (!str || str === "{}") {
    return [];
  }

  return str
    .split("{")[1]
    .split("}")[0]
    .split(",")
    .map((item) => parseInt(item));
};

export const ignorePages = (url) => {
  return url.includes("entrar") || url.includes("cadastro");
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const changeNameDays = (label) => {
  switch (label) {
    case "saturday_work":
      return "Sábado";
    case "sunday_work":
      return "Domingo";
    case "monday_work":
      return "Segunda-feira";
    case "tuesday_work":
      return "Terça-feira";
    case "wednesday_work":
      return "Quarta-feira";
    case "thursday_work":
      return "Quinta-feira";
    case "friday_work":
      return "Sexta-feira";
    case "working_days":
      return "Dias Úteis";

    default:
      return "Dia";
  }
};

export const formatDate = (string) => {
  const digits = parseDigits(string && string);
  const chars = digits.split("");
  return chars
    .reduce(
      (r, v, index) => (index === 2 || index === 4 ? `${r}/${v}` : `${r}${v}`),
      ""
    )
    .substr(0, 10);
};

export const parseDigits = (string) => (string?.match(/\d+/g) || []).join("");

export const parseDigitsWithSpecialChar = (string) => {
  let reg = /[0-9\)\(\+\-\s]+/g; // eslint-disable-line
  return (string?.match(reg) || []).join("");
};

export const formatCpf = (string) => {
  const digits = parseDigits(string && string).substr(0, 11);
  return formatToCPF(digits);
};

export const formatPhone = (string) => {
  const digits = parseDigitsWithSpecialChar(string && string);
  return digits;
};

export const removeAccents = (str) => {
  var map = {
    a: "á|à|ã|â|À|Á|Ã|Â",
    e: "é|è|ê|É|È|Ê",
    i: "í|ì|î|Í|Ì|Î",
    o: "ó|ò|ô|õ|Ó|Ò|Ô|Õ",
    u: "ú|ù|û|ü|Ú|Ù|Û|Ü",
    c: "ç|Ç",
    n: "ñ|Ñ",
  };

  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], "g"), pattern);
  }

  return str;
};

export const FormatToEuro = (value) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);

export const formatZip = (string) => {
  const digits = parseDigits(string).substr(0, 7);

  if (digits.length > 4) {
    return `${parseDigits(digits).substr(0, 4)}-${parseDigits(digits).substr(
      4,
      digits.length
    )}`;
  }
  return digits;
};

export const formatNIF = (string) => {
  const digits = parseDigits(string).substr(0, 9);

  if (digits.length > 6) {
    return `${parseDigits(digits).substr(0, 3)} ${parseDigits(digits).substr(
      3,
      3
    )} ${parseDigits(digits).substr(6, digits.length)}`;
  }

  if (digits.length > 3) {
    return `${parseDigits(digits).substr(0, 3)} ${parseDigits(digits).substr(
      3,
      digits.length
    )}`;
  }

  return digits;
};

export const formatFile = (link) => {
  if (link) {
    if (
      link?.includes(
        "vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      return link.replace(
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "docx"
      );
    } else if (link.includes("msword")) {
      return link.replace("msword", "doc");
    }
  }

  return link;
};

export const IsTrialExpired = (value) => {
  const trialAt = new Date(value);
  const expiredAt = new Date(trialAt.setMonth(trialAt.getMonth() + 3));

  return new Date().getTime() >= expiredAt.getTime();
};

export const downloadFile = (url) => {
  let filename = FileNameMineExtension(
    url.split("/")[url.split("/").length - 1]
  );

  fetch(url).then((response) => {
    response.blob().then((blob) => {
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      a.remove();
    });
  });
};

export const FileNameMineExtension = (value) => {
  const filename = value.split(".")[0];
  let extension = value.replace(`${filename}.`, "");
  extension = mime.getExtension(`application/${extension}`);

  return `${filename}.${extension}`;
};

export const PasswordTest = (value) => {
  console.log("value", value);
  if (value) {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/gm;
    console.log("value", 1);
    console.log("alue.match(reg)?.length > 0", value.match(reg)?.length > 0);
    return value.match(reg)?.length > 0;
  }
  console.log("value", 2);
  return false;
};
