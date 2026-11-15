'use strict';

// Caption providers sometimes escape SRT formatting before converting to VTT.
// Decode text only: no HTML parser, innerHTML, or executable markup is involved.
function decodeCaptionEntities(value) {
  const names = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0',lrm:'\u200e',rlm:'\u200f'};
  let text = String(value ?? '');
  for (let pass = 0; pass < 2; pass++) {
    const next = text.replace(/&(#(?:x[0-9a-f]{1,6}|[0-9]{1,7})|amp|lt|gt|quot|apos|nbsp|lrm|rlm);/gi, (whole, entity) => {
      if (entity[0] !== '#') return names[entity.toLowerCase()];
      const point = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2),16) : Number(entity.slice(1));
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : whole;
    });
    if (next === text) break;
    text = next;
  }
  return text;
}

const FORMAT_TAG = /<\s*\/?\s*(?:i|b|u|s|strike|font|span|ruby|rt|c(?:\.[\w-]+)*|v|lang)(?=[\s/>])[^<>\r\n]{0,512}>/gi;
const INLINE_TIME = /<(?:\d{2,}:)?\d{2}:\d{2}\.\d{3}>/g;
function plainText(value) {
  return decodeCaptionEntities(value).replace(/<\s*br\s*\/?\s*>/gi,'\n')
    .replace(FORMAT_TAG,'').replace(INLINE_TIME,'').replace(/\r\n?/g,'\n').trim();
}

function nativeText(value) {
  const escape = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // Re-enable only WebVTT's inert formatting tokens. Unknown markup remains text.
  return decodeCaptionEntities(value).split(/(<[^<>\r\n]{0,512}>)/g).map(part => {
    if (/^<\s*br\s*\/?\s*>$/i.test(part)) return '\n';
    const simple = part.match(/^<\s*(\/?)\s*(i|b|u|ruby|rt)(?:\s[^<>]*)?\s*>$/i);
    if (simple) return '<'+simple[1]+simple[2].toLowerCase()+'>';
    const classes = part.match(/^<\s*(\/?)\s*c((?:\.[\w-]+)*)\s*>$/i);
    if (classes) return classes[1] ? '</c>' : '<c'+classes[2]+'>';
    if (/^<\s*\/?\s*(?:font|span|s|strike|v|lang)(?=[\s/>])[^<>]*>$/i.test(part)) return '';
    if (/^<(?:\d{2,}:)?\d{2}:\d{2}\.\d{3}>$/.test(part)) return part;
    return escape(part);
  }).join('');
}

module.exports = {plainText,nativeText,decodeCaptionEntities};
