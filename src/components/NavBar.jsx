

export default function NavBar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between navInter">
                <div className="text-white font-bold text-xl">CyberDesk</div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-300 hover:text-white">Home</a>
                    <a href="#" className="text-gray-300 hover:text-white">About</a>
                    <a href="#" className="text-gray-300 hover:text-white">Contact</a>
                </div>
            </div>
        </nav>
    )
}