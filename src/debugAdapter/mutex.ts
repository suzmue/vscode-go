export class Mutex {
	private mutex = Promise.resolve();

	public lock(): PromiseLike<() => void> {
		let begin: (unlock: () => void) => void = (unlock) => {/** Do nothing but fix lint check :) */};

		this.mutex = this.mutex.then(() => {
		return new Promise(begin);
		});

		return new Promise((res) => {
			begin = res;
		});
	}

	public async dispatch(fn: (() => any) | (() => PromiseLike<any>)): Promise<any> {
		const unlock = await this.lock();
		try {
			return await Promise.resolve(fn());
		} finally {
			unlock();
		}
	}
}
