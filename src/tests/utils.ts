import { RenderResult, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";

import { BrowserRouter } from "react-router-dom";

export function mockFetch(response: any) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(response),
        } as Response)
    );
}

export const renderWithRouter = (ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>, {route = '/' } = {}): RenderResult & { user: UserEvent } => {
    window.history.pushState({}, 'Test page', route);
  
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: BrowserRouter }),
    };
  }