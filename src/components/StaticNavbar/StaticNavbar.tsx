 "use client"
   import { useSession , signOut} from "next-auth/react";
    import Link from "next/link";
    import ColourfulText from "@/components/ui/colourful-text";


function StaticNavbar() {
    const words = `Travello`;
    const { data: session } = useSession();
     const isCreator = session?.user?.role === "creator";
  return (
    <div className="w-full bg-black text-white py-6 px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
       <span className="block text-3xl sm:text-5xl font-bold  "><ColourfulText text={words} /></span>
        </div>    

        {/* Right side - Navigation items */}
        <div className=" hidden md:flex space-x-6 ml-auto">
          <Link href="/" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
            Home  
          </Link>
           {session?.user?.role === "admin" && (  <Link href="/admin" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
            Admin
          </Link>)}
          {isCreator && (
          <Link href="/trip/create" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
            Create Trip
          </Link>
          )}
          {isCreator &&(
            <Link href={`/creator/${session.user.id}`} className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
              my profile
            </Link>
          )}
         
          <Link href="/my-bookings" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
           my-bookings
          </Link>
          <Link href="/packages" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
            packages
          </Link>
          {/* <Link href="/contact" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
            Contact
          </Link>
           <Link href="/about" className="text-lg hover:text-purple-400 transition duration-300 ease-in-out">
            About
          </Link> */}
          {/* Show logout only when logged in */}
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-lg hover:text-red-400 transition duration-300 ease-in-out"
          >
            Logout
          </button>
        )}
        </div>
      </div>
  )
}

export default StaticNavbar