import React from "react";

interface AddedEmailsListProps {
  userEmails: string[];
}

const AddedEmailsList: React.FC<AddedEmailsListProps> = ({ userEmails }) => {
  return (
    <div>
      <h3>Added Email Addresses</h3>
      <ul>
        {userEmails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AddedEmailsList;
