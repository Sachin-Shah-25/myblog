// components/WhoToFollow.jsx

import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link"
import React from 'react'

const FollowComp = ({ data }) => {

  if (!data) {
    return;
  }
  return (
    <div className="w-full bg-white p-5 rounded-xl">

      <div className="space-y-4 mt-4">
        {data.map((user) => (
          <div
            key={user._id}
            className="flex flex-row w-full p-2 rounded-xl border border-gray-200 items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={user?.userImage ? `/profile/${user.userImage}` : `/image/image.png`}
                  alt="image1"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.nickname || "@" + user.name}
                </p>
              </div>
            </div>

            <Link
              href={`/viewuser/${user._id}`}
              className="text-sm px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition flex-shrink-0 text-center"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}
export default React.memo(FollowComp)
