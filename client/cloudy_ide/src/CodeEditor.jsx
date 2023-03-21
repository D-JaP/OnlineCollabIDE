import React, { useRef, useEffect } from 'react'
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import * as Y from 'yjs'
import {EditorState} from "@codemirror/state"
import {EditorView, ViewUpdate} from "@codemirror/view"
import { basicSetup } from 'codemirror';
import {githubLight} from '@ddietr/codemirror-themes/github-light'
import {githubDark} from '@ddietr/codemirror-themes/github-dark'


function CodeEditor({value, theme, lang, onChange}) {
    // setup code
    var cm_lang ;
    var cm_theme ;
    if (lang == "javascript") {
        cm_lang = javascript();
    }
    else if (lang  == "html") {
        cm_lang = html();
    }
    else if (lang == "css") {
        cm_lang = css();
    }

    if (theme == 'light'){
        cm_theme = githubLight;
    }
    else if (theme == 'dark') {
        cm_theme = githubDark;
    }

    const editorRef = useRef();
    const view = useRef();

    
    // 
    const parentElement = document.getElementById("editor-container");

    useEffect(() => {
        view.current = new EditorView({
            state: EditorState.create({
                doc: value,
                extensions: [
                    basicSetup,
                    cm_lang,
                    cm_theme,
                    EditorView.updateListener.of(({ state }) => {
                        onChange({ target: { value: state.doc.text?.join("\n") } });
                    }),
                ]
            }),
            parent: editorRef.current,
        });
        return () => {
            view.current.destroy();
            view.current = null;
        }
    }, [])

    // useEffect(() => {
    //     if (view.current && view.current.state.doc.toString() !== value) {
    //       view.current.dispatch({
    //         changes: { from: 0, to: view.current.state.doc.length, insert: "" }
    //       });
    //     }
    //   }, [value]);

    return <div ref={editorRef} id="editor-container" />;

}

export default CodeEditor