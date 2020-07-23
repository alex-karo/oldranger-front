import React, { useEffect, useState } from 'react';
import { List, Divider } from 'antd';
import { Link } from 'react-router-dom';
import querie from '../../serverQueries';

const ArticleDraft = () => {
  const [draftsArr, setDraftsArr] = useState([]);

  useEffect(() => {
    querie.getArticleDraft().then(res => {
      res.content.forEach(el => {
        const { id, title, text } = el;
        setDraftsArr(prev => {
          return [...prev, { id, title, text }];
        });
      });
    });
  }, []);

  const extractionText = (startId, endId, text) => {
    return text.substring(startId, endId);
  };

  return (
    <>
      <Divider orientation="left">Черновики</Divider>
      <List
        bordered
        dataSource={draftsArr}
        renderItem={({ id, title, text }) => (
          <List.Item style={{ height: '100px', fontSize: '16px' }}>
            <List.Item.Meta title={title} description={extractionText(3, text.length - 4, text)} />
            <Link to={`/article/${id}/update`}>Редактировать</Link>
          </List.Item>
        )}
      />
    </>
  );
};

export default ArticleDraft;
