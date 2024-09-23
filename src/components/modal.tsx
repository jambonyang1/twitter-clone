import styled from "styled-components";

interface ModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose?: () => void;
}

const Modal = ({
  title = "제목",
  content = "모달의 콘텐츠를 넣어주세요",
  isOpen,
  onClose,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalOverRay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{content}</p>
        <ModalBtns>
          <Btn onClick={onClose} color="#1d9bf0">
            확인
          </Btn>
          <Btn onClick={onClose} color="gray">
            취소
          </Btn>
        </ModalBtns>
      </ModalContent>
    </ModalOverRay>
  );
};

export default Modal;

const ModalOverRay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
`;

const ModalBtns = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
`;

const Btn = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 5px;
`;
