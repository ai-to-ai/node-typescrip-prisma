import { Context } from 'koa'
import { PrismaClient } from '@prisma/client'
import axios from 'axios';
import { MAIN_SERVER } from '../../config/constants';


const prisma = new PrismaClient()

async function getInscription(ctx: Context) {
    const ins: any = await prisma.inscriptions.findMany({
        include: {
            transactions: true
        }
    })

    console.log(ins)
    ctx.body = ins;
    await prisma.$disconnect()

}

async function getInscriptionByAddress(ctx: Context) {
    const addr = ctx.request.query.address as string;
    const pageNum = Number(ctx.request.query.pageNum);
    const perPage = Number(ctx.request.query.perPage);

    const ins: any = await prisma.addresses.findUnique({
        where: {
            address: addr
        },
        include: {
            inscriptions: {
                skip: (pageNum-1)*perPage,
                take: perPage
            },
        },
    })
    
    console.log(ins)
    ctx.body = ins;
    await prisma.$disconnect()
}

async function getLastestInscription(ctx: Context) {
    const limit = 2

    const ins: any = await prisma.blocks.findMany({
        orderBy: {
            date: 'desc'
        },
        select: {
            id: false,
            hash: false,
            date: false,
            transactions: {
                select: {
                    inscription: true
                },
            }
        },
    })

    var result: any[] = []
    ins.map((data: any) => {
        if (data.transactions.length > 0) {
            result = result.concat(data.transactions)
        }
    })

    ctx.body = ins.slice(limit);

    await prisma.$disconnect()
}


async function getInscriptionInRange(ctx: Context) {
    const start = 0
    const end = 5

    const result = await prisma.inscriptions.findMany({
        skip: start,
        take: end
    })

    console.log(result)
    ctx.body = result
    await prisma.$disconnect()
}

async function getInscriptionByContentType(contentType: string) {
    return new Promise<any>( async (resolve) => {
        const ins: any = await prisma.blocks.findMany({
            orderBy: {
                date: 'desc'
            },
            select: {
                id: false,
                hash: false,
                date: false,
                transactions: {
                    select: {
                        inscription: true
                    },
                }
            },
        })
    
        var result: any[] = []
        ins.map((data: any) => {
            for (let i=0; i<data.transactions.length; i++) {
                if (data.transactions[i].inscription.content_type == contentType)
                    result.push(data.transactions[i].inscription)
            }
        })
    
        // console.log(result)
    
        await prisma.$disconnect()
        
        resolve(result)

    })
}

function getContentFromInscription(ctx: Context) {
    const id = ctx.request.query.id

    const response = axios.get(MAIN_SERVER+'/content/'+id);
}

async function getInscriptionFromSock(block_id: number, content_type: string, transfer: Boolean) {
    const result = await prisma.blocks.findUnique({
        where: {
            id: block_id + 1
        },
        select: {
            hash: true,
            transactions: {
                select: {
                    from_address: true,
                    to_address: true,
                    inscription: true
                }
            }
        },
    })

    if (!result) return 'no new block';

    var inscriptions: any[] = []

    result?.transactions.map((data: any) => {
        var tmpObj: any = {}
        tmpObj['hash'] = result.hash
        tmpObj['from_address'] = data.from_address
        tmpObj['to_address'] = data.to_address
        tmpObj['nr'] = data.inscription.nr
        if (data.inscription.content_type == content_type) {
            if (transfer) {
                inscriptions.push(tmpObj)
            } else {
                if (data.from_address == '') {
                    inscriptions.push(tmpObj)
                }
            }
        }
    })

    var sendData = { "block": block_id + 1, "inscriptions": inscriptions }

    return sendData
}


export default {
    getInscription,
    getInscriptionByAddress,
    getLastestInscription,
    getInscriptionInRange,
    getContentFromInscription,
    getInscriptionByContentType,
    getInscriptionFromSock
}