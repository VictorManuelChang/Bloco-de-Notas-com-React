import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { useMemo } from "react"
import {v4 as uuidV4} from "uuid"
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

export type Note = {  //Cria um novo tipo que adiciona um ID para o tipo NoteData que já existe
  id:string
} &NoteData 

export type RawNote = { //Para a gente só precisar modificar o tipo Tag, onde tem o id, sem precisar modificar os outros
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() {
  const[notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const[tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => { //converter os RawNote in to real Notes
    /*Hey look through all my different notes and for each one of them, i want you to keep all the information about the notes 
    but I also want you to get the tags that have the associated ID inside of our note that has been stored */
      return notes.map(note => {
        return { ...note, tags: tags.filter(tag  => note.tagIds.includes(tag.id))}
      })
  }, [notes, tags]) //We only run this every time our notes or tags gets updated

  function onCreateNotes({tags, ...data} : NoteData) {
    setNotes(prevNotes => {
      return [...prevNotes,{ ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
    }) 
  }

  function onUpdateNote(id: string,  { tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id) {
          return  { ...note, ...data, tagIds: tags.map(tag => tag.id)}
        }else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id) {
          return {...tag, label}
        }else{
          return tag
        }
      })
    })
  }

function deleteTag(id:string) {
  setTags(prevTags => {
    return prevTags.filter(tag => tag.id !== id)
  })
}

  return (
    <Container className="my-4"> {/* my-4 é para dar um espaçamento mais legal */}
      <Routes>
        <Route path="/" element= {<NoteList notes={notesWithTags} availableTags={tags} onUpdateTag = {updateTag} onDeleteTag = {deleteTag} />} />
        <Route path="/new" element={<NewNote onSubmit = {onCreateNotes} onAddTag = {addTag} availableTags = {tags} />} />
        <Route path="/:id" element = {<NoteLayout notes = {notesWithTags}/>}> {/*para direcionar ao nosso bloco de notas
         e pegar uma nota individualmente*/}
          <Route index element={<Note onDelete = {onDeleteNote} />} />
          <Route path="edit" element={<EditNote onSubmit = {onUpdateNote} onAddTag = {addTag} availableTags = {tags}/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
