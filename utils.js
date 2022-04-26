import { block } from 'nanocurrency-web'

import rpc from './rpc.js'
import constants from './constants.js'

export const createSendBlock = async ({
  accountInfo,
  to,
  amount,
  privateKey,
  workerUrl
}) => {
  const data = {
    walletBalanceRaw: accountInfo.balance,
    fromAddress: accountInfo.account,
    toAddress: to,
    representativeAddress: constants.BURN_ACCOUNT,
    frontier: accountInfo.frontier,
    amountRaw: amount
  }

  const action = {
    action: 'work_generate',
    hash: accountInfo.frontier,
    difficulty: constants.WORK_THRESHOLD_BETA
  }
  const res = await rpc(action, { url: workerUrl })

  data.work = res.work

  return block.send(data, privateKey)
}

export const createReceiveBlock = async ({
  accountInfo,
  hash,
  amount,
  privateKey,
  workerUrl
}) => {
  const data = {
    walletBalanceRaw: accountInfo.balance,
    toAddress: accountInfo.account,
    representativeAddress: constants.BURN_ACCOUNT,
    frontier: accountInfo.frontier,
    transactionHash: hash,
    amountRaw: amount
  }

  const action = {
    action: 'work_generate',
    hash: accountInfo.frontier,
    difficulty: constants.WORK_THRESHOLD_BETA
  }
  const res = await rpc(action, { url: workerUrl })

  data.work = res.work

  return block.receive(data, privateKey)
}

export const createOpenBlock = async ({
  account,
  hash,
  amount,
  publicKey,
  privateKey,
  workerUrl
}) => {
  const data = {
    walletBalanceRaw: '0',
    toAddress: account,
    representativeAddress: constants.BURN_ACCOUNT,
    frontier: constants.ZEROS,
    transactionHash: hash,
    amountRaw: amount
  }

  const action = {
    action: 'work_generate',
    hash: publicKey,
    difficulty: constants.WORK_THRESHOLD_BETA
  }
  const res = await rpc(action, { url: workerUrl })

  data.work = res.work

  return block.receive(data, privateKey)
}

export const createChangeBlock = async ({
  accountInfo,
  rep,
  privateKey,
  workerUrl
}) => {
  const data = {
    walletBalanceRaw: accountInfo.balance,
    address: accountInfo.account,
    representativeAddress: rep,
    frontier: accountInfo.frontier
  }

  const res = await rpc(
    {
      action: 'work_generate',
      hash: accountInfo.frontier,
      difficulty: constants.WORK_THRESHOLD_BETA
    },
    {
      url: workerUrl
    }
  )

  data.work = res.work

  return block.representative(data, privateKey)
}
