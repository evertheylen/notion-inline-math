// ==UserScript==
// @name Inline Math for Notion.so
// @homepageURL https://www.notion.so/evertheylen/Notion-Inline-Math-9c5047a4e7c84643848b3630db8d5a5e
// @version 0.2.1
// @match https://www.notion.so/*
// @grant GM_addStyle
// @require https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.js
// ==/UserScript==

// Instructions for use:
//   - Make sure you have at least one normal math block on your page
//   - Use inline code starting with "math:". For example: `math: f(x) = x^2`
//   - Press F2 to rerender all inline math. You can of course change the shortcut in the code below.
//   - The inline math will revert to inline code when the block becomes active.

GM_addStyle(`
.notion-frame span .katex {
    padding-right: 0 !important;
}
`)

function rerender_all() {
    var code = document.querySelectorAll("span[style*=\"monospace\"]")
    code.forEach(function(el) {
        var s = el.textContent
        if (s.startsWith("math:")) {
            el.style.color = null
            el.style.background = null
            s = s.slice(5).trim()
            console.log("rendering ", s)
            katex.render(s, el, {throwOnError: false, font: 'mathit'})
        }
    })
}

window.addEventListener('keydown', function(e) {
    if (e.key == "F2" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        console.log("rerender!");
        rerender_all()
    }
}, true)

// I don't know a good way to trigger rerender automatically yet
//document.addEventListener('DOMContentLoaded', rerender_all, false);
