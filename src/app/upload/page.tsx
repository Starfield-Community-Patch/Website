'use client';

import type { PutBlobResult } from '@vercel/blob';
import { redirect } from 'next/navigation';
import { useState, useRef } from 'react';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  if (process.env.NODE_ENV === 'production') return redirect('404');

  return (
    <>
      <h1>Upload Your Avatar</h1>

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
        <button type="submit" disabled={!version}>Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}