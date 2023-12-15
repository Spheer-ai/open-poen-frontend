import React from "react";
import styles from "../../../../assets/scss/FundsUsers.module.scss";

const FundsUsers: React.FC<{ initiativeOwners: any[] }> = ({
  initiativeOwners,
}) => {
  return (
    <div>
      <div className={styles["user-list-container"]}>
        {initiativeOwners.map((owner, index) => (
          <div className={styles["user-container"]}>
            <div className={styles["user-image"]}>
              {owner.profile_picture ? (
                <img
                  src={owner.profile_picture.attachment_thumbnail_url_128}
                  alt="Profile"
                  className={styles["profile-image"]}
                />
              ) : (
                <img
                  src="../../../profile-placeholder.png"
                  alt="Profile"
                  className={styles["profile-image"]}
                />
              )}
            </div>
            <div className={styles["user-card"]} key={index}>
              <span>
                {owner.first_name} {owner.last_name}
              </span>
              <p>{owner.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundsUsers;
