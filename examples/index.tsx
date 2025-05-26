import React, { ChangeEvent, useEffect, useState } from 'react';
import { Builder, CFormCardContainer, CFormGroup, CSection, CForm, CInput, CoffeelessWrapper } from 'coffeeless-form'
import { createRoot } from 'react-dom/client';
import './css/main.css';


type Props = {
  onChange: any
  value?: any
  id: string
  name: string
  label?: string
  disabled?: boolean
  labelStyle?: any
  selectStyle?: any
}
export interface FullReference {
  id?: number
  lastName: string
  title: string
  publisher?: string
  isbn?: string
  url: string
  firstName: string
  year: string
  location?: string
  pages?: string
  referenceType: 'WEB' | 'BOOK'
}

export interface Post {
  id: number
  createdAt: string
  updatedAt: string
  upNextUrl: string
  upNextName: string
  previousUrl: string
  previousName: string
  portraitImage: string
  name: string
  abs: string | null
  moduleTopics: string
  slug: string
  postContent: PostContent
  type: string | null
  tags: Tag[]
  postFullReferences: Array<{
    fullReference: FullReference
    pages: string | null
  }>
  posted: boolean
  indexableList: string | null
}

export interface PostContent {
  title: string
  description: string
  postAdditionals: PostAdditionals
  postBody: PostBody
}

export interface PostAdditionals {
  type: string | null
  placeholder: string
}

export interface PostBody {
  name: string
  description: string
}

export interface Tag {
  id?: number
  name: string
  slug: string
}

export interface SavePostDto extends Post {
  previousIndexableList: string[],
  updateEntries: string[],
  metadataListToUpdate: string[]
}

const SelectBox: React.FC<Props & { children: any }> = ({
  id,
  name,
  onChange,
  value,
  label,
  disabled,
  children,
  labelStyle,
  selectStyle
}) => {
  return (
    <>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
      <select
        disabled={disabled}
        className="form-control"
        id={id}
        onChange={onChange}
        name={name}
        value={value}
        style={selectStyle}
      >
        {children}
      </select>
    </>
  )
}

const Contact: React.FC = () => {
  const [state, setForm] = useState<SavePostDto>({
    id: 0,
    createdAt: '',
    updatedAt: '',
    portraitImage: '',
    name: '',
    tags: [],
    postFullReferences: [],
    upNextName: '',
    upNextUrl: '',
    abs: '',
    moduleTopics: '',
    postContent: {
      description: '',
      postAdditionals: {
        placeholder: '',
        type: 'SEARCH'
      },
      postBody: {
        description:
          '<h1 class="editor-text">An introduction to computing</h1><p class="editor-text graf--p">Paragraph 2</p>',
        name: ''
      },
      title: ''
    },
    previousName: '',
    previousUrl: '',
    slug: '',
    type: '',
    posted: false,
    indexableList: null,
    previousIndexableList: [],
    updateEntries: [],
    metadataListToUpdate: []
  })

  useEffect(() => {
    console.log(state)
  })

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    const updatePath: string[] = name.split('.')
    let copy = state

    updatePath.forEach((path, idx) => {
      if (idx === updatePath.length - 1) {
        ;(copy as any)[path] = value
      } else {
        copy = (copy as any)[path]
      }
    })

    setForm({ ...state })
  }

  return (
    <CoffeelessWrapper<Post>
      initialValues={state}
      validationSchema={{
        name: Builder.init().required().min(2).build(),
        portraitImage: Builder.init().required().build(),
        abs: Builder.init().required().min(100).build(),
        postContent: {
          title: Builder.init().required().min(2).build(),
          description: Builder.init().required().min(2).build(),
          postAdditionals: {
            placeholder: Builder.init().required().min(2).build()
          },
          postBody: {
            description: Builder.init().required().min(2).build()
          }
        }
      }}
      skipSchemaValidation={{
        portraitImage: state.type !== 'ARTICLE',
        postContent: {
          postAdditionals: {
            placeholder: state.postContent.postAdditionals.type === 'NONE',
          }
        }
      }}
    >
      <CForm
        handleSubmit={() => {console.log('Submitted')}}
        handleCancel={() => {}}
        submitText={'Submit'}
        includeFormButtons
      >
        <CSection col="col-md-12">
          <CFormCardContainer cardTitle="Post navbar" cardDescription="heading info">
            <CFormGroup>
              <CInput
                id="title"
                label="Title"
                name="postContent.title"
                onChange={onChange}
                placeholder="Title for the post"
                type="text"
                value={state.postContent.title}
              />
            </CFormGroup>
            <CFormGroup>
              <CInput
                id="description"
                label="Description"
                name="postContent.description"
                onChange={onChange}
                placeholder={'Description'}
                type="text"
                value={state.postContent.description}
              />
            </CFormGroup>
            <CFormGroup>
              <SelectBox
                // disabled
                label="Type"
                id="select-additional-type"
                onChange={onChange}
                name="postContent.postAdditionals.type"
                value={state.postContent.postAdditionals!.type}
              >
                {[{value: 'LIST_IMAGE'}, {value: 'SEARCH'}, {value: 'NONE'}].map(lovDetail => (
                  <option key={lovDetail.value} value={lovDetail.value}>
                    {lovDetail.value}
                  </option>
                ))}
              </SelectBox>
            </CFormGroup>
            <CFormGroup>
              <CInput
                id="placeholder"
                label="Placeholder"
                name={'postContent.postAdditionals.placeholder'}
                onChange={onChange}
                placeholder={'enter placeholder'}
                type="text"
                value={state.postContent.postAdditionals.placeholder}
              />
            </CFormGroup>
          </CFormCardContainer>

          <CFormCardContainer
            cardTitle="Post content"
            cardDescription="write your post"
          >
            <CFormGroup>
              <CInput
                id="abstract"
                label="Abstract"
                name={'abs'}
                onChange={onChange}
                placeholder={'enter abstract'}
                type="textarea"
                value={state.abs}
                rows={4}
              />
            </CFormGroup>
            <CFormGroup>
              <CInput
                id="moduleTopics"
                label="Module topics"
                name="moduleTopics"
                onChange={onChange}
                placeholder="module topics"
                type="textarea"
                rows={5}
                value={state.moduleTopics}
              />
            </CFormGroup>
            <CFormGroup>
              <label htmlFor="select-additional-type">Description</label>
            </CFormGroup>
          </CFormCardContainer>
        </CSection>
      </CForm>
    </CoffeelessWrapper>
  )
}

const container = document.getElementById('main')
const root = createRoot(container!)

root.render(<Contact />)
