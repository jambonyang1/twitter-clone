import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const onEdit = async () => {
    if (user?.uid !== userId || tweet.length > 300) return;
    try {
      if (isEditing) {
        await updateDoc(doc(db, "tweets", id), {
          tweet: editTweet,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsEditing((isEditing) => !isEditing);
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <PayloadEdit
            onChange={onChange}
            rows={8}
            maxLength={300}
            value={editTweet}
          ></PayloadEdit>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <ButtonsWrapper>
            <EditButton onClick={onEdit}>
              {isEditing ? "저장" : "편집하기"}
            </EditButton>
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          </ButtonsWrapper>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
};

export default Tweet;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  grid-auto-rows: minmax(100px, auto);
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  word-break: break-all; /* 텍스트가 넘칠 때 강제로 줄 바꿈 */
  line-height: 1.5;
`;

const PayloadEdit = styled.textarea`
  margin: 10px 0px;
  width: 100%;
  height: auto;
  font-size: 18px;
  resize: none;
  background-color: black;
  color: white;
  border: none;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;
