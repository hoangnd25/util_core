// Setting @src as alias for ./src folder, so no ../../../../../ is needed anymore
// has to be done in eslintrc.js and tsconfig.json and next.config.js as well
module.exports = {
  "plugins": [
    ["module-resolver", {
      "alias": {"@src": "./src"}
    }],
    ["transform-imports",
     process.env.NODE_ENV==="production" ?{
        "@go1d/go1d": {
          "transform":function (importName, matches) {
            switch(importName) {
              case "foundations": return `@go1d/go1d/build/foundations/index`;
              case "globalCSS": return `@go1d/go1d/build/foundations/globalCSS`;
              case "DropdownItem": return `@go1d/go1d/build/components/Dropdown/DropdownItem`;
              case "LI": return `@go1d/go1d/build/components/UL/LI`;
              case "NotificationContainer": return `@go1d/go1d/build/components/Notification/NotificationContainer`;
              case "NotificationManager": return `@go1d/go1d/build/components/Notification/NotificationManager`;
              // Checked till Letter "I"
              default: return `@go1d/go1d/build/components/${importName}`;
            }
          },
          "preventFullImport": true
        },
      } : {}
    ],
    [ "react-intl", {
      "messagesDir": "./src/translation/messages"
    }]
  ],
  "presets": [
    "next/babel",
  ]
};
