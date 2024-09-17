import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const user = auth.currentUser;
  const onEdit = async () => {};
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
        <Payload>{tweet}</Payload>
        <Editor>
          <EditButton>편집하기</EditButton>
          {user?.uid === userId ? (
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          ) : null}
        </Editor>
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
`;

const Editor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const EditButton = styled.span`
  color: gray;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  text-decoration: underline;
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
  cursor: porinter;
`;
