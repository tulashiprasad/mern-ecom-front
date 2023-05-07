import { Button } from 'antd';
import Upload from 'antd/es/upload/Upload';
import React from 'react'

const Images = ({ selectedProduct, setSelectedProduct, setShowProductForm, getData }) => {
    
  return (
      <div>
          <Upload
              listType='picture'
              beforeUpload={() => false}
          >
              <Button
              type='dashed'
              >Upload Image</Button>              
          </Upload>
    </div>
  )
}

export default Images