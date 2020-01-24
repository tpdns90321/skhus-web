const VISIBLE = 'drawer/VISIBLE' as const;
const INVISIBLE = 'drawer/INVISIBLE' as const;

export const visible = () => ({ type: VISIBLE });
export const invisible = () => ({ type: INVISIBLE });

type DrawerAction = 
  | ReturnType<typeof visible>
  | ReturnType<typeof invisible>

type DrawerState = {
  visible: boolean;
}

const initialState: DrawerState = {
  visible: false,
}

function drawer(state: DrawerState = initialState, action: DrawerAction) {
  switch (action.type) {
    case VISIBLE:
      return { visible: true }
    case INVISIBLE:
      return { visible: false }
    default:
      return state;
  }
}

export default drawer;
