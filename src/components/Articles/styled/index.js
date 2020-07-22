import styled from 'styled-components';
import { InputNumber } from 'formik-antd';
import { Form as AntForm } from 'antd';

export const StyledMenu = styled.div`
  height: fit-content;
  width: 300px;
  box-shadow: 0px 0px 16px -2px rgba(0, 0, 0, 0.2);
`;

export const Column = styled.div`
  display: flex;
  margin-left: 20px;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
`;

export const Container = styled.div`
  display: flex;
`;

export const Row = styled.div`
  display: flex;
  justify-content: center;
  .ant-form-item-children {
    display: flex;
  }
`;

export const StyledInput = styled(InputNumber)`
  width: 200px;
  margin: 0 5px 5px 0;
`;

export const StyledDate = styled.span`
  display: block;
`;

export const StyledUserInfo = styled.div`
  text-align: right;
`;

export const StyledTags = styled.div`
  display: flex;
`;

export const StyledMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  overflow: hidden;
`;

export const StyledArticle = styled.article`
  padding: 32px 24px 24px 24px;
  border-radius: 2px;
  margin-bottom: 24px;
  box-shadow: 0px 0px 16px -2px rgba(0, 0, 0, 0.2);
`;

export const StyledTitle = styled.h1`
  padding: 2px 0;
  font-size: 25px;
  width: 100%;
  border-bottom: 1px solid #1890ff;
  text-align: center;
  margin: 0;
`;

export const StyledCenteredContainer = styled.div`
  display: flex;
  min-height: 500px;
  font-size: 18px;
  justify-content: center;
  align-items: center;
`;

export const StyledHeader = styled.h1`
  text-align: center;
  font-weight: 600;
  font-size: 24px;
`;
export const TagsItem = styled.p`
  cursor: ${props => (props.cursor === 'default' ? 'default' : 'pointer')};
  margin: 0;
  display: flex;
  height: 40px;
  flex-direction: row;
  align-items: center;
  transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    background 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
    padding 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding-left: ${props => `${props.pad * 20}px`};
  color: ${props => (props.active === props.activeId ? '#1890ff' : 'black')};
  background-color: ${props => (props.active === props.activeId ? '#e6f7ff' : 'white')};
  border-right: 3px solid ${props => (props.active === props.activeId ? '#1890ff' : 'white')};
`;

export const StyledForm = styled(AntForm)`
  text-align: right;
  .ant-form-item-children-icon {
    display: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;
