import { Fragment, useRef } from "react";
import { WordState } from "../models/Word";
import clsx from "clsx";

import styles from "./WordBuffer.module.css";
import { TypingState } from "../models/Typing";

const SPACE_CHARACTER = String.fromCharCode(160);

type Props = {
    state: TypingState;
};

export const WordBuffer = (props: Props) => {
    const { state } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div
                className={styles.wordBuffer}
                onClick={() => {
                    inputRef.current?.focus();
                }}
            >
                {state.nodes.map((node, nodeIndex) => {
                    // const isCurrentNode = nodeIndex === state.current;

                    return (
                        <Fragment key={node.id}>
                            <span
                                className={clsx(styles.character, {
                                    [styles.currentCharacter]:
                                        nodeIndex === state.current,
                                    [styles.error]: node.status === "incorrect",
                                    [styles.correct]: node.status === "correct",
                                })}
                            >
                                {node.value}
                            </span>
                        </Fragment>
                    );
                })}

                {/* {words.map((wordState, wordIndex) => { */}
                {/*     const isCurrentWord = currentWordIndex === wordIndex; */}
                {/**/}
                {/*     return ( */}
                {/*         <Fragment key={wordState.id}> */}
                {/*             <span className={clsx(styles.word)}> */}
                {/*                 {wordState.characters.map( */}
                {/*                     (characterState, characterIndex) => { */}
                {/*                         const isCurrentCharacter = */}
                {/*                             isCurrentWord && */}
                {/*                             characterIndex === */}
                {/*                                 wordState.characterIndex; */}
                {/**/}
                {/*                         return ( */}
                {/*                             <span */}
                {/*                                 key={characterState.id} */}
                {/*                                 className={clsx( */}
                {/*                                     styles.character, */}
                {/*                                     { */}
                {/*                                         [styles.currentCharacter]: */}
                {/*                                             isCurrentCharacter, */}
                {/*                                         [styles.error]: */}
                {/*                                             characterState.status === */}
                {/*                                             "incorrect", */}
                {/*                                         [styles.correct]: */}
                {/*                                             characterState.status === */}
                {/*                                             "correct", */}
                {/*                                     }, */}
                {/*                                 )} */}
                {/*                             > */}
                {/*                                 {characterState.character} */}
                {/*                             </span> */}
                {/*                         ); */}
                {/*                     }, */}
                {/*                 )} */}
                {/*             </span> */}
                {/**/}
                {/*             {wordIndex !== words.length - 1 && ( */}
                {/*                 <span */}
                {/*                     className={clsx(styles.character, { */}
                {/*                         [styles.currentCharacter]: */}
                {/*                             isCurrentWord && */}
                {/*                             wordState.characterIndex === */}
                {/*                                 wordState.characters.length, */}
                {/*                     })} */}
                {/*                 > */}
                {/*                     {SPACE_CHARACTER} */}
                {/*                 </span> */}
                {/*             )} */}
                {/*         </Fragment> */}
                {/*     ); */}
                {/* })} */}
            </div>
        </>
    );
};
