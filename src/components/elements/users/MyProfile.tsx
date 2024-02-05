import React, { useEffect, useState } from "react";
import styles from "../../../assets/scss/Contacts.module.scss";
import ProfileIcon from "../../../assets/profile-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { getUserById } from "../../middleware/Api";

interface DecodedToken {
  sub: string;
}

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: {
    attachment_url: string;
  };
  email: string;
}

interface MyProfileProps {
  user: { token: string } | null;
  isActive: boolean;
  userItemId: string | null;
  handleUserClick: (clickedUserId: string, isProfile: boolean) => void;
}

const MyProfile: React.FC<MyProfileProps> = ({
  user,
  isActive,
  handleUserClick,
}) => {
  const [myProfileData, setMyProfileData] = useState<UserProfile | null>(null);
  const [userItemId, setUserItemId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      try {
        const token = user.token;
        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = decodedToken.sub;

        setUserItemId(userId);

        const fetchData = async () => {
          try {
            const userData: UserProfile = await getUserById(userId, token);
            setMyProfileData(userData);

            if (isActive) {
              navigate(`/contacts/${userId}`);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };

        fetchData();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [user, isActive]);

  if (!myProfileData) {
    return null;
  }

  const fullName = `${myProfileData.first_name} ${myProfileData.last_name}`;

  return (
    <div className={`${styles["user-list-profile"]}`}>
      <div
        onClick={() => handleUserClick(userItemId || "", true)}
        className={`${styles["user-list"]} ${
          isActive ? styles["active-user"] : ""
        }`}
        style={{
          backgroundColor: isActive ? styles["active-user"] : "white",
        }}
      >
        <Link
          to={`/contacts/${userItemId}`}
          className={`${styles["user-link"]}`}
        >
          <div className={styles["profile"]}>
            {myProfileData.profile_picture && (
              <img
                src={myProfileData.profile_picture.attachment_url}
                alt="Profile"
                className={styles["profile-image"]}
              />
            )}
            {!myProfileData.profile_picture && (
              <img
                src="../../../profile-placeholder.png"
                alt="Profile"
                className={styles["profile-image"]}
              />
            )}
            <div className={styles["user-info"]}>
              <p data-tip={fullName}>{fullName}</p>
              <p
                className={styles["profile-email"]}
                data-tip={myProfileData.email}
              >
                {myProfileData.email}
              </p>
            </div>
            <div>
              <img
                src={ProfileIcon}
                alt="Profile Icon"
                className={styles["profile-icon"]}
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MyProfile;
