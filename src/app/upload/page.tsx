'use client';

import type { PutBlobResult, ListBlobResultBlob } from '@vercel/blob';
import { list } from '@vercel/blob';
import { redirect } from 'next/navigation';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [history, setHistory] = useState<ListBlobResultBlob[] | null>(null);

  if (process.env.NODE_ENV === 'production') return redirect('404');

  const getHistory = async () => {
    const response = await fetch(
      `/api/papyrus/list`,
    );

    const list = await response.json();

    console.log(list);

    setHistory(list as ListBlobResultBlob[]);
  }

  return (
    <>
      <h1>Upload Source Files</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          const response = await fetch(
            `/api/papyrus/upload?filename=${file.name}&version=${version}`,
            {
              method: 'POST',
              body: file,
            },
          );

          const newBlob = (await response.json()) as PutBlobResult;

          setBlob(newBlob);
        }}
      >
        <input name="file" accept='.7z' ref={inputFileRef} type="file" required />
        <input type="text" onChange={(e) => setVersion(e.target.value)} value={version ?? undefined} placeholder='Version' />
        <button type="submit" className='mx-2 bg-stripe-blue rounded-md hover:bg-stripe-orange text-white' disabled={!version}>Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
      <div className='pt-8'>
        <hr/>
        <h2>Uploaded Files</h2>
        {history && history.map(h => (<div key={h.pathname}><a href={h.url}>{h.pathname}</a></div>)) }
        <button type="submit" onClick={getHistory} className='my-2 bg-stripe-blue rounded-md hover:bg-stripe-orange text-white'>Get Uploads</button>
      </div>
    </>
  );
}