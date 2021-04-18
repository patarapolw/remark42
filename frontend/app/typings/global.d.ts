import 'jest-fetch-mock';
import type { Theme } from 'common/types';

export type RemarkConfig = {
  host: string;
  site_id: string;
  url?: string;
  max_shown_comments?: number;
  theme?: Theme;
  page_title?: string;
  node?: string | HTMLElement;
  locale?: string;
  show_email_subscription?: boolean;
  max_last_comments?: number;
  __colors__?: Record<string, string>;
};

declare global {
  interface Window {
    remark_config?: RemarkConfig;
    REMARK42: {
      changeTheme?: (theme: Theme) => void;
      destroy?: () => void;
      createInstance: (
        remark_config: RemarkConfig
      ) =>
        | {
            changeTheme(theme: Theme): void;
            destroy(): void;
          }
        | undefined;
      createLastComment: (remark_config: RemarkConfig) => Promise<void>;
      createCounter: (remark_config: RemarkConfig) => void;
    };
  }

  namespace NodeJS {
    interface Global {
      Headers: typeof Headers;
      localStorage: typeof Storage;
    }
  }
}

/**
 * Veriable responsive for dynamic setting public path for
 * assets. Dynamic imports with relative url will be resolved over this path.
 *
 * https://webpack.js.org/guides/public-path/#on-the-fly
 */
declare let __webpack_public_path__: string;
