package com.avengers.nibobnebob.presentation.ui.main.global.userdetail

import android.os.Bundle
import android.view.View
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.avengers.nibobnebob.R
import com.avengers.nibobnebob.databinding.FragmentUserDetailBinding
import com.avengers.nibobnebob.presentation.base.BaseFragment
import com.avengers.nibobnebob.presentation.ui.main.MainViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class UserDetailFragment : BaseFragment<FragmentUserDetailBinding>(R.layout.fragment_user_detail) {

    override val parentViewModel: MainViewModel by activityViewModels()
    private val viewModel: UserDetailViewModel by viewModels()
    private val args: UserDetailFragmentArgs by navArgs()
    private val nickName by lazy { args.nickName }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.vm = viewModel
        viewModel.setNick(nickName)
        viewModel.getUserDetail()
        initEventObserver()
    }

    private fun initEventObserver() {
        repeatOnStarted {
            viewModel.events.collect {
                when (it) {
                    is UserDetailEvents.NavigateToBack -> findNavController().navigateUp()
                    is UserDetailEvents.ShowSnackMessage -> showSnackBar(it.msg)
                    is UserDetailEvents.ShowToastMessage -> showToastMessage(it.msg)
                }
            }
        }
    }

}