import React,{useEffect, useState} from 'react'
import axios from 'axios'
function ToSendNewsletter() {
  const [emailStatus, setEmailStatus] = useState('')
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  useEffect(() => {
  axios.get('http://localhost:4001/getEmail')
  },[])
  
const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(() => {
    console.log(selectedFile);
  },[selectedFile])

  const handleFileUpload = (e) => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios
      .post('http://localhost:4001/upload', formData)
      .then((response) => {
        setUploadStatus('File uploaded successfully: ' + response.data.location);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        setUploadStatus('Error uploading file. Please try again.');
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:4001/sendEmail')
      .then((response) => {
        setEmailStatus('Email sent successfully!');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setEmailStatus('Error sending email. Please try again.');
      });
  };

  return (
    <div>
    <br />
    <br />
    <label className="form-label" htmlFor="customFile">Upload your Newsletter here</label>
    <input type="file" className="form-control" id="customFile" onChange={handleFileChange} />
    <br />
    <button onClick={handleFileUpload}>Upload</button>
    {uploadStatus}
    <br />
    <br />
    <br />
    <form onSubmit={handleSubmit}>
      <button type="submit">Send Email</button>
    </form>
    {emailStatus}
    </div>
  )
}

export default ToSendNewsletter