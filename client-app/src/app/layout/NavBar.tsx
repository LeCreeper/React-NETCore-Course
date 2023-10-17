import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';

export default function Navbar() {
   const { activityStore } = useStore();

   return (
      <div>
         <Menu fixed='top' inverted className='main-header'>
            <Container>
               <Menu.Item header>
                  <img src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} />
                  Reactivities
               </Menu.Item>
               <Menu.Item name='Activities' />
               <Menu.Item>
                  <Button
                     onClick={() => activityStore.openForm()}
                     positive
                     content='Create Activity'
                  />
               </Menu.Item>
            </Container>
         </Menu>
      </div>
   );
}
