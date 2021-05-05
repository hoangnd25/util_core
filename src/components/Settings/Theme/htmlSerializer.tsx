import * as React from "react";
import Html, { Rule } from "slate-html-serializer";
import { Value as SlateValue } from 'slate';
import { stripTabsAndNewLines } from "./formHelper";

enum BLOCK_TAGS {
  blockquote = "block-quote",
  p = "paragraph",
  h2 = "heading-two",
  h3 = "heading-three",
}

// Add a dictionary of mark tags.
enum MARK_TAGS {
  strong = "bold",
  em = "italic",
  s = "strikethrough",
  u = "underline",
}

enum LIST_TAGS {
  ol = "numbered-list",
  li = "list-item",
  ul = "bulleted-list",
}

enum INLINE {
  br = "linebreak",
}

export const rules: Rule[] = [
  {
    deserialize(el: Element, next: any) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        if (el.parentNode.nodeName === "BODY") {
          return {
            object: "block",
            type,
            data: {
              className: el.getAttribute("class"),
            },
            nodes: next(el.childNodes),
          };
        } else {
          return next(el.childNodes);
        }
      }

      const listType = LIST_TAGS[el.tagName.toLowerCase()];
      if (listType) {
        return {
          object: "block",
          type: listType,
          data: {
            className: el.getAttribute("class"),
          },
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj: any, children: any) {
      if (obj.object === "block") {
        switch (obj.type) {
          case "heading-two":
            return <h2>{children}</h2>;
          case "heading-three":
            return <h3>{children}</h3>;
          case "paragraph":
            if (obj.text === "") {
              return <p>&nbsp;</p>;
            }
            return <p>{children}</p>;
          case "block-quote":
            return <blockquote>{children}</blockquote>;
          case "numbered-list":
            return <ol>{children}</ol>;
          case "bulleted-list":
            return <ul>{children}</ul>;
          case "list-item":
            return <li>{children}</li>;
        }
      }
    },
  },
  {
    deserialize(el: Element, next: any) {
      const type = INLINE[el.tagName.toLowerCase()];
      if (type) {
        // return empty paragraph if block level linebreak
        if (el.parentNode.nodeName === "BODY") {
          return {
            object: "block",
            type: "paragraph",
            nodes: next(el.childNodes),
            text: " ",
          };
        }
        return {
          object: "inline",
          type,
          data: {
            className: el.getAttribute("class"),
          },
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj: any) {
      if (obj.object === "inline") {
        switch (obj.type) {
          case "linebreak":
            return <br />;
        }
      }
    },
  },
  {
    deserialize(el: Element, next: any) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: "mark",
          type,
          nodes: next(el.childNodes),
        };
      }
    },
    serialize(obj: any, children: any) {
      if (obj.object === "mark") {
        switch (obj.type) {
          case "bold":
            return <strong>{children}</strong>;
          case "italic":
            return <em>{children}</em>;
          case "strikethrough":
            return <s>{children}</s>;
          case "underline":
            return <u>{children}</u>;
        }
      }
    },
  },
  {
    // special case for links to grab href
    deserialize(el: Element, next: any) {
      if (el.tagName.toLowerCase() === "a") {
        return {
          object: "inline",
          type: "link",
          nodes: next(el.childNodes),
          data: {
            href: el.getAttribute("href"),
          },
        };
      }
    },
    serialize(obj: any, children: any) {
      if (obj.object === "inline") {
        switch (obj.type) {
          case "link":
            const { data } = obj;
            const href = data.get("href");
            return <a href={href}>{children}</a>;
        }
      }
    },
  },
];

export const htmlSerializer = new Html({ rules });

export const deserializeHtml = (input: string) => {
  if (typeof window !== 'undefined' && typeof input === 'string') {
    return htmlSerializer.deserialize(stripTabsAndNewLines(input));
  }

  return undefined;
}

export const serializeHtml = (input?: SlateValue) => {
  if (!input) {
    return undefined;
  }

  return htmlSerializer.serialize(input);
}
