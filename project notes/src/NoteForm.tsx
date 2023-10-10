import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable"
import { NoteData, Tag } from './App';
import { v4 as uuidV4 } from 'uuid';

type NoteFormProps = {
    onSubmit: (data: NoteData) => void  //passa a infomação do noteData e não espera nada em retorno
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

export function NoteForm( {onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [],} : NoteFormProps ) {
    const titleRef = useRef<HTMLInputElement>(null); {/*Lugar para guarda informações na área de título */}
    const markdownRef = useRef<HTMLTextAreaElement>(null); {/*Lugar para guarda informações na área de texto */}
    const [selectedTags, setSelectedTags] = useState<Tag[]> (tags)
    const navigate = useNavigate() 

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        onSubmit({
            title:titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
        })

        navigate("..") // usar navigate para voltar à pagina inicial quando a gente apertar em "Save" ou "Cancel"
    }

    return <Form onSubmit={handleSubmit}>   
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId="title">  {/*Colocar um id to hook together our label and our input usando controlId */}
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} required defaultValue={title}/> {/*required defaultValue: 
                        Para salvar o conteúdo do título quando for editar */}
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags"> 
                        <Form.Label>Tags</Form.Label>
                        <CreatableReactSelect 
                        onCreateOption={label => {
                            const newTag = {id: uuidV4(), label}
                            onAddTag(newTag)
                            setSelectedTags(prev => [...prev, newTag]) //So we are taking all our existing tags and adding this newTag onto the end of our selected tags
                        }}
                        value={selectedTags.map(tag => { {/*Para cada um desses tag,
                        a gente quer retornar um objeto que tenha a propriedade label e retorna um valor id */}
                            return {label: tag.label, value: tag.id}
                        })}
                        options={availableTags.map(tag => {
                            return { label: tag.label, value: tag.id}
                        })}
                        onChange={tags => { {/*Onchange para modificar os nosso valores */}
                            setSelectedTags(tags.map(tag => {
                                return{label: tag.label, id: tag.value}
                            }))
                        }} 
                        isMulti/>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markdown"> 
                        <Form.Label>Body</Form.Label>
                        <Form.Control defaultValue={markdown} required as = "textarea" ref={markdownRef} rows = {15} /> {/*Para ser uma grande area de texto, com rows para determinar o tamanho */}
            </Form.Group>
            <Stack direction="horizontal" gap={2} className="justify-content-end">
                {/*Para colocar elementos lado a lado horizontalmente e 
                usar o justify-content-end para empurrar os butões para a extrema direita */}
                <Button type="submit" variant="primary" > 
                {/*Com tipo de botão "submit" que faz o envio de informações 
                e com "primary" para ficar com aquela azul bonita no botão */}
                    Save
                </Button>

                <Link to=".."> {/*Para quando apertar "Cancel" a gente voltar uma página para trás */}
                <Button type="button" variant="outline-secondary" >
                {/*Com tipo de botão "button" normal
                e com "outline-secondaryj" para ficar com aquele cinza apagado no botão */}
                    Cancel
                </Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
}