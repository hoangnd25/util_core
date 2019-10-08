module.exports = {
  "plugins": process.env.NODE_ENV==="production" ? [
    ["transform-imports", {
      "@go1d/go1d": {
        "transform":function (importName, matches) {
          if (importName == "foundations") {
            return `@go1d/go1d/build/foundations/index`;
          }
          if (importName == "globalCSS") {
            return `@go1d/go1d/build/foundations/globalCSS`;
          }
          if (importName == "globalCSS") {
            return `@go1d/go1d/build/foundations/globalCSS`;
          }
          if (importName == "NotificationContainer") {
            return `@go1d/go1d/build/components/Notification/NotificationContainer`;
          }
          return `@go1d/go1d/build/components/${importName}`;
        },
        "preventFullImport": true
      },
    }],
  ] : [],
  "presets": [
    "next/babel",
  ]
};
