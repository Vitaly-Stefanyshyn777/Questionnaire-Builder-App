import Link from 'next/link';

export default function Header() {
 return (
  <header className=''>
   <div className='container py-14'>
    <h1 className='text-center font-bold text-3xl text-primary'>
     <Link href='/quiz'>Quiz catalog</Link>
    </h1>
   </div>
  </header>
 );
}
