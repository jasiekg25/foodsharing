import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './fileUplader.css';
import {CameraFill} from "react-bootstrap-icons";

const FileUplader = ({file, setFile}) => {
  const [files, setFiles] = useState([]);

    useEffect(() => {
        if(file !== null){
            setFiles([Object.assign(file, {
                preview: file
            })])
        }
    }, [])

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const thumbs = files.map(file => (
    <div className='thumb' key={file.name}>
      <div className='thumbInner'>
        <img
          src={file.preview}
          className='img'
        />
      </div>
    </div>
  ));

  return (
    <section className="container">
      <div className='uplader-container' {...getRootProps()}>
        <input {...getInputProps()} type="file" />
        <CameraFill size={70}/>
      </div>
      <aside className='thumbsContainer'>
        {thumbs}
      </aside>
    </section>
  );
}

export default FileUplader;