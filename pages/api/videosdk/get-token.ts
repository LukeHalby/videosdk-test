import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPRequestMethods, tAPIRequest, tAPIResponseError, tAPIResponseSuccess } from 'shared-types';
import { APIError, isAPIError } from '../../../utils/apiError';
import jwt, { SignOptions } from 'jsonwebtoken';
import { 
	VIDEOSDK_API_KEY,
	VIDEOSDK_SECRET
} from '../../../config/env.config'

const SUPPORTED_HTTP_METHODS: HTTPRequestMethods[] = ['GET'];

export type tAPIGETRequestVideosdkGetToken = {}
export type tAPIGETResponseVideosdkGetToken = tAPIResponseSuccess<{ token: string }>

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === undefined || !SUPPORTED_HTTP_METHODS.includes(req.method as HTTPRequestMethods)) {
      res.setHeader('Allow', SUPPORTED_HTTP_METHODS.join(', '));
      throw new APIError(405, 'METHOD NOT ALLOWED', `Request Method ${req.method} is not allowed`);
    }

    switch (req.method as HTTPRequestMethods) {
      case 'GET': {
				const options: SignOptions = { 
					expiresIn: '10m', 
					algorithm: 'HS256' 
				};
				const payload = {
					apikey: VIDEOSDK_API_KEY,
					permissions: [`allow_join`], // `ask_join` || `allow_mod` 
					version: 2,
					roles: ['CRAWLER'],
				};
				const token = jwt.sign(payload, VIDEOSDK_SECRET, options);

        return res.status(200).json({
          data: { token },
        } as tAPIGETResponseVideosdkGetToken);
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