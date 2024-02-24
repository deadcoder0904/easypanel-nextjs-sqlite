'use client'

import React from 'react'

export function GetData() {
  const [json, setJSON] = React.useState({})

  React.useEffect(() => {
    async function main() {
      await getAll()
    }
    main()
  }, [])

  const handleAdd = async () => {
    const res = await fetch('/api/add', { method: 'POST' })
    const data = await res.json()
    setJSON(data)
  }

  const getAll = async () => {
    const res = await fetch('/api/get')
    const data = await res.json()
    setJSON(data)
  }

  const handleDelete = async () => {
    const res = await fetch('/api/delete')
    const data = await res.json()
    setJSON(data)
  }

  return (
    <>
      <button type="button" name="add" onClick={handleAdd}>
        Add One
      </button>
      <button type="button" name="add" onClick={getAll}>
        Get All
      </button>
      <button type="button" name="delete" onClick={handleDelete}>
        Delete All
      </button>
      <p>{JSON.stringify(json, null, 2)}</p>
    </>
  )
}
