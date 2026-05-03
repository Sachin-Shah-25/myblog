import Link from "next/link"

const ProfileFollow = ({ user }) => {
    return <div
        key={user._id}
        className="flex w-full p-2 rounded-xl  border border-gray-200 items-center justify-between"
    >
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                    src={
                        user?.userImage
                            ? `/profile/${user.userImage}`
                            : `/image/image.png`
                    }
                    alt="image1"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                />
            </div>

            <div>
                <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                    </p>
                </div>

                <p className="text-xs text-gray-500">
                    {user.nickname || "@" + user.name}
                </p>
            </div>
        </div>

        <Link
            href={`/viewuser/${user._id}`}
            className="text-sm px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
        >
            View Profile
        </Link>
    </div>

}
export default ProfileFollow