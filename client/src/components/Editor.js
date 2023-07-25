import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/clike/clike'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../actions';



const Editor = ({socketRef , roomId , onCodeChange}) => {

    const editorRef = useRef(null)

    useEffect(()=>{
        const init = async()=>{
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor') , {
                mode : {name : 'javascript' , json:true},
                theme : 'dracula',
                autoCloseTags : true,
                autoCloseBrackets : true,
                lineNumbers : true
            })

            editorRef.current.on('change' , (instance , changes)=>{
                // console.log('changes' , changes);
                const {origin} = changes;
                const code = instance.getValue();
                onCodeChange(code)
                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHNAGE , {
                        roomId ,
                        code
                    })
                }
                // console.log(code);
            })  //change is codemirror listner

            // socketRef.current.on(ACTIONS.CODE_CHNAGE , ({code})=>{
            //     if(code !== null){
            //         editorRef.current.setValue(code)
            //     }
            // })

        }
        
        init();
    } , [])

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHNAGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHNAGE);
        };
    }, [socketRef.current]);

  return (
    <div>
        <textarea id='realTimeEditor'></textarea>
    </div>
  )
}

export default Editor