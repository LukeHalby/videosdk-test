import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPRequestMethods, tAPIRequest, tAPIResponseError, tAPIResponseSuccess } from 'shared-types';
import { APIError, isAPIError } from '../../../utils/apiError';

const SUPPORTED_HTTP_METHODS: HTTPRequestMethods[] = ['POST'];

export type tAPIPOSTRequestVideosdkValidateMeeting = { token: string, roomId: string }
export type tAPIPOSTResponseVideosdkValidateMeeting = tAPIResponseSuccess<{ valid: boolean }>


export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === undefined || !SUPPORTED_HTTP_METHODS.includes(req.method as HTTPRequestMethods)) {
      res.setHeader('Allow', SUPPORTED_HTTP_METHODS.join(', '));
      throw new APIError(405, 'METHOD NOT ALLOWED', `Request Method ${req.method} is not allowed`);
    }

    switch (req.method as HTTPRequestMethods) {
      case 'POST': {
        let { token, roomId } = req.body as tAPIPOSTRequestVideosdkValidateMeeting;

        const options = {
          method: "GET",
          headers: {
            "Authorization": token,
            "Content-Type": "application/json",
          },
        };

        const url= `https://api.videosdk.live/v2/rooms/validate/${roomId}`;
        const response = await fetch(url, options);
        
        if (response.status !== 200) {
          return res.status(200).json({
            data: { valid: false },
          } as tAPIPOSTResponseVideosdkValidateMeeting);
        }

        const data = await response.json();

        return res.status(200).json({
          data: { valid: !data.disabled },
        } as tAPIPOSTResponseVideosdkValidateMeeting);
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