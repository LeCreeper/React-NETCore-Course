import { Button, Container, Menu } from 'semantic-ui-react';

interface Props {
	openForm: () => void;
}

export default function Navbar({ openForm }: Props) {
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
						<Button onClick={openForm} positive content='Create Activity' />
					</Menu.Item>
				</Container>
			</Menu>
		</div>
	);
}
