import React from "react"
import { render } from "react-dom"
import { fromEvent, from } from "rxjs"
import { map, mergeMap, scan, startWith } from "rxjs/operators"
import { Stream } from "react-streams"

const keydown$ = fromEvent(document, "keydown").pipe(
  map(({ key }) => ({ letter: key }))
)

const word$ = from("friendly")

const hangman$ = keydown$.pipe(
  startWith([]),
  scan((letters, { letter }) => [...letters, letter]),
  mergeMap(letters =>
    word$.pipe(
      map(check => (letters.includes(check) ? check : "*")),
      scan((prev, next) => `${prev}${next}`)
    )
  ),
  map(result => ({ result }))
)

const App = () => (
  <div>
    <Stream source={keydown$}>{({ letter }) => letter}</Stream>
    <hr />
    <Stream source={hangman$}>{({ result }) => result}</Stream>
  </div>
)

render(<App />, document.getElementById("root"))
