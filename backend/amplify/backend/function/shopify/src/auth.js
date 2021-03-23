require('dotenv').config()
const crypto = require('crypto')
const queryString = require('query-string')
const axios = require('axios')
const { LOGGER, getQueryParameters } = require('./helpers')

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY
const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET
const INSTALL_REDIRECT_URL = process.env.INSTALL_REDIRECT_URL
const APP_NAME = process.env.APP_NAME
ACCESS_MODE = []
SCOPES = ['read_orders']

function generateInstallRedirectUrl(shop, nonce, scopes, accessMode) {
  scopes = scopes || SCOPES
  accessMode = accessMode || ACCESS_MODE
  scopesString = scopes.join(',')
  accessModeString = accessMode.join(',')

  return `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopesString}&redirect_uri=${INSTALL_REDIRECT_URL}&state=${nonce}&grant_options[]=${accessModeString}`
}

function generatePostInstallRedirectUrl(shop) {
  return `https://${shop}/admin/apps/${APP_NAME}`
}

async function getAccessToken(shop, code) {
  LOGGER(code, "cooooooooode")
  let res
  try {
    res = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_SECRET,
      code: code
    })
    res
  } catch (error) {
    LOGGER(error, 'axios error')
  }
  LOGGER(res.data.access_token, 'axios access token')
  return res.data.access_token
}

function validateShopName(shop) {
  return /[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com[\/]?/.test(shop)
}

/**
 * @param {string} data
 * @param {string} hmac
 * @param {string} secret
 */
function verifyHmac(data, hmac, secret) {
  LOGGER(data, 'verifyHmac:data')
  LOGGER(hmac, 'verifyHmac:hmac')
  return (
    crypto
      .createHmac('SHA256', secret || SHOPIFY_SECRET)
      .update(data)
      .digest('hex') === hmac
  )
}

function verifyOAuth(event, secret) {
  LOGGER('', 'Verifying OAuth')
  const { hmac, ...data } = getQueryParameters(event)
  if (!validateShopName(data.shop)) {
    LOGGER('Invalid shop name')
    return false
  }
  return hmac ? verifyHmac(queryString.stringify(data), hmac, secret) : false
}

function verifyWebhook(event, secret) {
  LOGGER('', 'Verifying Webhook')
  const hmacHeader = event.headers['X-Shopify-Hmac-Sha256']

  return hmacHeader
    ? verifyHmac(
        event.body,
        Buffer.from(hmacHeader, 'base64').toString('hex'),
        secret
      )
    : false
}

function verifyShopify(event, secret) {
  if (process.env.STAGE === 'dev') return true
  if (verifyWebhook(event, secret) || verifyOAuth(event, secret)) return true
  throw new Error('Auth verification failed!')
}

module.exports = {
  verifyShopify,
  getQueryParameters,
  generateInstallRedirectUrl,
  generatePostInstallRedirectUrl,
  getAccessToken
}
