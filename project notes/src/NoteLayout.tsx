import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
     notes: Note[]
}

export function NoteLayout({ notes}: NoteLayoutProps) {
    const { id} = useParams()
    const note = notes.find(n => n.id === id) //Procurar em todas as notas e ver se você encontra aquele id

    if(note == null) return <Navigate to = "/" replace />

    return <Outlet context={note} />
}

export function useNote() {
    return useOutletContext<Note>() //useOutletContext é usado dentro do Outlet
}