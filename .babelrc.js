module.exports = {
  "plugins": process.env.NODE_ENV==="production" ? [
    ["transform-imports", {
      "@go1d/go1d": {
        "transform":function (importName, matches) {
          switch(importName) {
            case "foundations": return `@go1d/go1d/build/foundations/index`;
            case "globalCSS": return `@go1d/go1d/build/foundations/globalCSS`;
            case "DropdownItem": return `@go1d/go1d/build/components/Dropdown/DropdownItem`;
            case "LI": return `@go1d/go1d/build/components/UL/LI`;
            case "NotificationContainer": return `@go1d/go1d/build/components/Notification/NotificationContainer`;
            // Checked till Letter "I"
            default: return `@go1d/go1d/build/components/${importName}`;
          }
        },
        "preventFullImport": true
      },
    }],
  ] : [],
  "presets": [
    "next/babel",
  ]
};
