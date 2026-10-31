import { useNavigate } from 'react-router-dom';
import Picture from '../../assets/404.png';
import Image from '../../components/Image';
import { Button } from '@heroui/react';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className='text-7xl text-blue-500 font-extrabold'>Page not found</h1>
      <Image src={Picture} className="object-contain"/>
      <Button className="rounded-xl" size='lg' onClick={()=> navigate("/")}>
        Go Home
      </Button>
    </div>
  )
}

export default Page404