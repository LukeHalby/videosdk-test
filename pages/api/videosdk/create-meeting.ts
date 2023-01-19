import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPRequestMethods, tAPIRequest, tAPIResponseError, tAPIResponseSuccess } from '../../../src/utils/apiTypes';
import { APIError, isAPIError } from '../../../src/utils/apiError';

const SUPPORTED_HTTP_METHODS: HTTPRequestMethods[] = ['POST'];

export type tAPIPOSTRequestVideosdkCreateMeeting = { token: string }
export type tAPIPOSTResponseVideosdkCreateMeeting = tAPIResponseSuccess<{ roomId: string }>

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === undefined || !SUPPORTED_HTTP_METHODS.includes(req.method as HTTPRequestMethods)) {
      res.setHeader('Allow', SUPPORTED_HTTP_METHODS.join(', '));
      throw new APIError(405, 'METHOD NOT ALLOWED', `Request Method ${req.method} is not allowed`);
    }

    switch (req.method as HTTPRequestMethods) {
      case 'POST': {
        const { token } = req.body as tAPIPOSTRequestVideosdkCreateMeeting;
        console.log(token)
        const options = {
          method: "POST",
          headers: {
            "Authorization": token,
            "Content-Type": "application/json",
          }
        };

        const response = await fetch(`https://api.videosdk.live/v2/rooms`, options)
        const data = await response.json()
        console.log(data)
        
        return res.status(200).json({
          data: { roomId: data.roomId },
        } as tAPIPOSTResponseVideosdkCreateMeeting);
      }

      default: {
        // Invalid req.method should have already been caught
        res.setHeader('Allow', SUPPORTED_HTTP_METHODS.join(', '));
        throw new APIError(405, 'METHOD NOT ALLOWED', `Request Method ${req.method} is not allowed`);
      }
    }
  } catch (error: unknown) {
    if (isAPIError(error)) {
      return res.status(error.statusCode()).json({
        error: {
          status: error.statusCodeStr(),
          title: error.title(),
          detail: error.detail(),
        },
      } as tAPIResponseError);
    }

    return res.status(500).send({
      error: {
        status: '500',
        title: 'SERVER ERROR',
        detail: 'Unknown server error occured',
      },
    } as tAPIResponseError);
  }
}