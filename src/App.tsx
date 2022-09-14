import { useEffect, useState, FormEvent } from 'react';
import * as Photos from './services/photos'
import { Area, Container, PhotoList, ScreenWarning, UploadForm } from './App.styles';
import { Photo } from './types/Photo';
import PhotoItem from './components/PhotoItem';

function App() {

  const [upload, setUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if(file && file.size > 0) {
      setUpload(true);
      let result = await Photos.insert(file);
      setUpload(false);

      if(result instanceof Error) {
        alert(`${result.name} - ${result.message}`)
      } else{
        let newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
    
    setTimeout(() => {
      document.location.reload()
    }, 3000)
  }

  const getPhotos = async () => {
    setLoading(true);
    setPhotos(await Photos.getAll())
    setLoading(false);
  }

  useEffect(() => {
    getPhotos();
  }, [])

  const handleDeleteClick = async (name: string) => {
    await Photos.deletePhoto(name);
    getPhotos();
  }

  return (
    <Container>
      <Area>
        <h1>Galeria de fotos</h1>

        <UploadForm method='POST' onSubmit={handleFormSubmit}>
          <input type="file" name="image"/>
          <input type="submit" value="Enviar" />
          {upload && 'Enviando...'}
        </UploadForm>

        {loading &&
        <ScreenWarning>
          <div className="emoji">✋</div>
            <div>Carregando...</div>
        </ScreenWarning>
        }

        {!loading && photos.length > 0 &&
          <PhotoList>
            {photos.map((item, index) => (
              <PhotoItem 
                key={index}
                url={item.url}
                name={item.name}
                onDelete={handleDeleteClick}/>
              ))}
          </PhotoList>
          }

          {!loading &&  photos.length === 0 &&
            <ScreenWarning>
              <div className='emoji'>😢</div>
              <div>Nao ha fotos cadastradas.</div>
            </ScreenWarning>
          }
      </Area>
    </Container>
  );
}

export default App;

