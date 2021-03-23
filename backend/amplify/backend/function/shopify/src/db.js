const AWS = require('aws-sdk')
const { LOGGER } = require('./helpers')
const { v4: uuidv4 } = require('uuid')

const skipEmptyValue = obj => {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (v.Value ? ((a[k] = v), a) : a),
    {}
  )
}

const dynamo = new AWS.DynamoDB.DocumentClient()

async function updateStore(storeId, props = {}) {
  LOGGER(props, 'updateStore props')
  const params = {
    TableName: process.STORE_TABLE,
    Key: {
      store_id: storeId
    },
    ReturnValues: 'UPDATED_NEW',
    AttributeUpdates: skipEmptyValue({
      nonce: { Action: 'PUT', Value: props.nonce },
      access_token: { Action: 'PUT', Value: props.accessToken }
    })
  }
  try {
    const res = await dynamo.update(params).promise()
    LOGGER(JSON.stringify(res), 'Dynamo update result')
  } catch (err) {
    return err
  }
}

async function deleteAttribute(storeId, attribute) {
  const params = {
    TableName: process.env.STORE_TABLE,
    Key: {
      store_id: storeId
    },
    ReturnValues: 'UPDATED_NEW',
    AttributeUpdates: {
      [attribute]: { Action: 'DELETE' }
    }
  }
  try {
    const res = await dynamo.update(params).promise()
    LOGGER(JSON.stringify(res), 'Dynamo delete result')
  } catch (err) {
    return err
  }
}

async function deleteStore(storeId) {
  const params = {
    Key: {
      store_id: storeId
    },
    TableName: process.env.STORE_TABLE
  }
  try {
    const data = await dynamo.delete(params).promise()
    return data
  } catch (err) {
    return {}
  }
}

async function getStoreInfo(storeId) {
  const params = {
    Key: {
      store_id: storeId
    },
    TableName: process.env.STORE_TABLE
  }
  try {
    const data = await dynamo.get(params).promise()
    LOGGER(data, 'Store info')
    return data.Item
  } catch (err) {
    return {}
  }
}

async function checkIfUserExist(user) {
  var params2 = {
    ExpressionAttributeValues: { ":email": user}, 
    KeyConditionExpression: "email = :email",
    TableName: process.env.STORE_USERS_TABLE
   };

  try{
    let data = await dynamo.query(params2).promise();
    return data.Items;
  } catch(error) {
      return error;
  }
}

async function signUp(user) {
  LOGGER(user, "user")
  const id = uuidv4(); 
  const email = user
  var params = {
    TableName: process.env.STORE_USERS_TABLE,
    Item: {
      id, email,
    }
  }
  try{
    let data = await dynamo.put(params).promise();
    LOGGER(data, "coool cool cool")
    return data.Items;
  } catch(error) {
    return error;

  }
}



module.exports = {
  updateStore,
  getStoreInfo,
  deleteStore,
  deleteAttribute,
  signUp,
  checkIfUserExist
}
